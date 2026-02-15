/// Converts Markdown to Atlassian Document Format (ADF)
///
/// Supports:
/// - Headers (# ##)
/// - Bold (**text**)
/// - Italic (*text*)
/// - Code blocks (```)
/// - Bullet lists (-)
/// - Numbered lists (1.)
use pulldown_cmark::{Event, Options, Parser, Tag, TagEnd};
use serde_json::{json, Value};

pub fn markdown_to_adf(markdown: &str) -> Value {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_TABLES);
    options.insert(Options::ENABLE_STRIKETHROUGH);

    let parser = Parser::new_ext(markdown, options);
    let mut content: Vec<Value> = Vec::new();
    let mut current_paragraph: Vec<Value> = Vec::new();
    let mut current_text = String::new();
    let mut current_marks: Vec<Value> = Vec::new();
    let mut list_items: Vec<Value> = Vec::new();
    let mut in_list = false;
    let mut list_type = String::new();

    for event in parser {
        match event {
            Event::Start(Tag::Heading { .. }) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                flush_paragraph(&mut current_paragraph, &mut content);
            }
            Event::End(TagEnd::Heading(level)) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                if !current_paragraph.is_empty() {
                    content.push(json!({
                        "type": "heading",
                        "attrs": {
                            "level": level as u8
                        },
                        "content": current_paragraph.clone()
                    }));
                    current_paragraph.clear();
                }
            }
            Event::Start(Tag::Strong) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                current_marks.push(json!({"type": "strong"}));
            }
            Event::End(TagEnd::Strong) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                current_marks.retain(|m| m["type"] != "strong");
            }
            Event::Start(Tag::Emphasis) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                current_marks.push(json!({"type": "em"}));
            }
            Event::End(TagEnd::Emphasis) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                current_marks.retain(|m| m["type"] != "em");
            }
            Event::Start(Tag::CodeBlock(_)) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                flush_paragraph(&mut current_paragraph, &mut content);
            }
            Event::End(TagEnd::CodeBlock) => {
                if !current_text.is_empty() {
                    content.push(json!({
                        "type": "codeBlock",
                        "content": [{
                            "type": "text",
                            "text": current_text.clone()
                        }]
                    }));
                    current_text.clear();
                }
            }
            Event::Start(Tag::List(None)) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                flush_paragraph(&mut current_paragraph, &mut content);
                in_list = true;
                list_type = "bulletList".to_string();
            }
            Event::Start(Tag::List(Some(_))) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                flush_paragraph(&mut current_paragraph, &mut content);
                in_list = true;
                list_type = "orderedList".to_string();
            }
            Event::End(TagEnd::List(_)) => {
                if !list_items.is_empty() {
                    content.push(json!({
                        "type": list_type.clone(),
                        "content": list_items.clone()
                    }));
                    list_items.clear();
                }
                in_list = false;
            }
            Event::Start(Tag::Item) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
            }
            Event::End(TagEnd::Item) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                if !current_paragraph.is_empty() {
                    list_items.push(json!({
                        "type": "listItem",
                        "content": [{
                            "type": "paragraph",
                            "content": current_paragraph.clone()
                        }]
                    }));
                    current_paragraph.clear();
                }
            }
            Event::Text(text) => {
                current_text.push_str(&text);
            }
            Event::Code(code) => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                current_paragraph.push(json!({
                    "type": "text",
                    "text": code.to_string(),
                    "marks": [{"type": "code"}]
                }));
            }
            Event::SoftBreak | Event::HardBreak => {
                current_text.push('\n');
            }
            Event::End(TagEnd::Paragraph) if !in_list => {
                flush_text(&mut current_text, &mut current_paragraph, &current_marks);
                flush_paragraph(&mut current_paragraph, &mut content);
            }
            _ => {}
        }
    }

    // Flush any remaining content
    flush_text(&mut current_text, &mut current_paragraph, &current_marks);
    flush_paragraph(&mut current_paragraph, &mut content);

    // Ensure at least one paragraph exists
    if content.is_empty() {
        content.push(json!({
            "type": "paragraph",
            "content": []
        }));
    }

    json!({
        "version": 1,
        "type": "doc",
        "content": content
    })
}

fn flush_text(text: &mut String, paragraph: &mut Vec<Value>, marks: &[Value]) {
    if text.is_empty() {
        return;
    }

    let mut node = json!({
        "type": "text",
        "text": text.clone()
    });

    if !marks.is_empty() {
        node["marks"] = json!(marks);
    }

    paragraph.push(node);
    text.clear();
}

fn flush_paragraph(paragraph: &mut Vec<Value>, content: &mut Vec<Value>) {
    if paragraph.is_empty() {
        return;
    }

    content.push(json!({
        "type": "paragraph",
        "content": paragraph.clone()
    }));
    paragraph.clear();
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_plain_text() {
        let md = "Hello world";
        let adf = markdown_to_adf(md);

        assert_eq!(adf["type"], "doc");
        assert_eq!(adf["content"][0]["type"], "paragraph");
        assert_eq!(adf["content"][0]["content"][0]["text"], "Hello world");
    }

    #[test]
    fn test_bold_text() {
        let md = "This is **bold** text";
        let adf = markdown_to_adf(md);

        let content = &adf["content"][0]["content"];
        assert_eq!(content[1]["marks"][0]["type"], "strong");
        assert_eq!(content[1]["text"], "bold");
    }

    #[test]
    fn test_heading() {
        let md = "## Problem Summary\n\nDetails here";
        let adf = markdown_to_adf(md);

        assert_eq!(adf["content"][0]["type"], "heading");
        assert_eq!(adf["content"][0]["attrs"]["level"], 2);
        assert_eq!(adf["content"][1]["type"], "paragraph");
    }

    #[test]
    fn test_bullet_list() {
        let md = "- Item 1\n- Item 2";
        let adf = markdown_to_adf(md);

        assert_eq!(adf["content"][0]["type"], "bulletList");
        assert_eq!(adf["content"][0]["content"].as_array().unwrap().len(), 2);
    }

    #[test]
    fn test_code_block() {
        let md = "```\ncode here\n```";
        let adf = markdown_to_adf(md);

        assert_eq!(adf["content"][0]["type"], "codeBlock");
        assert_eq!(adf["content"][0]["content"][0]["text"], "code here\n");
    }

    #[test]
    fn test_mixed_formatting() {
        let md = "**Bold** and *italic* and `code`";
        let adf = markdown_to_adf(md);

        let content = &adf["content"][0]["content"];
        assert_eq!(content[0]["marks"][0]["type"], "strong");
        assert_eq!(content[2]["marks"][0]["type"], "em");
        assert_eq!(content[4]["marks"][0]["type"], "code");
    }
}
