use crate::commands::settings::get_jira_client;
use crate::models::JiraTicket;
use tauri::AppHandle;

#[tauri::command]
pub async fn fetch_jira_ticket(app: AppHandle, ticket_id: String) -> Result<JiraTicket, String> {
    fetch_jira_ticket_impl(app, ticket_id)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn post_to_jira(app: AppHandle, ticket_id: String, comment: String) -> Result<(), String> {
    post_to_jira_impl(app, ticket_id, comment)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn attach_files_to_jira(
    app: AppHandle,
    ticket_id: String,
    file_paths: Vec<String>,
) -> Result<(), String> {
    attach_files_to_jira_impl(app, ticket_id, file_paths)
        .await
        .map_err(|e| e.to_string())
}

async fn attach_files_to_jira_impl(
    app: AppHandle,
    ticket_id: String,
    file_paths: Vec<String>,
) -> Result<(), Box<dyn std::error::Error>> {
    let client = get_jira_client(app).await?;

    let mut failed_files = Vec::new();

    for file_path in &file_paths {
        let path = std::path::Path::new(file_path);
        match client.attach_file(&ticket_id, path).await {
            Ok(_) => {},
            Err(e) => {
                failed_files.push(format!("{}: {}", file_path, e));
            }
        }
    }

    if !failed_files.is_empty() {
        return Err(format!(
            "Failed to attach {} file(s):\n{}",
            failed_files.len(),
            failed_files.join("\n")
        ).into());
    }

    Ok(())
}

async fn fetch_jira_ticket_impl(
    app: AppHandle,
    ticket_id: String,
) -> Result<JiraTicket, Box<dyn std::error::Error>> {
    let client = get_jira_client(app).await?;
    let ticket = client.fetch_issue(&ticket_id).await?;
    Ok(ticket)
}

async fn post_to_jira_impl(
    app: AppHandle,
    ticket_id: String,
    comment: String,
) -> Result<(), Box<dyn std::error::Error>> {
    let client = get_jira_client(app).await?;
    client.post_comment(&ticket_id, &comment).await?;
    Ok(())
}
