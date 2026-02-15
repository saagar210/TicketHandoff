use crate::db;
use crate::keychain;
use crate::models::ApiConfig;
use crate::services::jira::JiraClient;
use tauri::AppHandle;

#[tauri::command]
pub async fn save_api_config(_app: AppHandle, config: ApiConfig) -> Result<(), String> {
    save_api_config_impl(config).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_api_config(_app: AppHandle) -> Result<Option<ApiConfig>, String> {
    get_api_config_impl().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn test_jira_connection(_app: AppHandle) -> Result<String, String> {
    test_jira_connection_impl().await.map_err(|e| e.to_string())
}

fn save_api_config_impl(config: ApiConfig) -> Result<(), Box<dyn std::error::Error>> {
    let has_any_jira_input = !config.jira_base_url.is_empty()
        || !config.jira_email.is_empty()
        || !config.jira_api_token.is_empty();

    if has_any_jira_input {
        if config.jira_base_url.is_empty() || config.jira_email.is_empty() {
            return Err("Jira base URL and email are required when saving Jira settings.".into());
        }

        if !config.jira_api_token.is_empty() {
            keychain::save_jira_credentials(
                &config.jira_base_url,
                &config.jira_email,
                &config.jira_api_token,
            )?;
        } else {
            let (_, existing_token) = keychain::get_jira_credentials(&config.jira_email)
                .map_err(|_| "Jira API token is required for initial setup.")?;
            keychain::save_jira_credentials(
                &config.jira_base_url,
                &config.jira_email,
                &existing_token,
            )?;
        }
    }

    // Save Ollama config to database
    db::save_api_config(&config)?;
    Ok(())
}

fn get_api_config_impl() -> Result<Option<ApiConfig>, Box<dyn std::error::Error>> {
    // Get Ollama config from database
    let mut config = db::get_api_config()?.unwrap_or_else(|| ApiConfig {
        jira_base_url: String::new(),
        jira_email: String::new(),
        jira_api_token: String::new(),
        ollama_endpoint: "http://localhost:11434".to_string(),
        ollama_model: "llama3".to_string(),
    });

    if !config.jira_email.is_empty() {
        if let Ok((base_url, _token)) = keychain::get_jira_credentials(&config.jira_email) {
            config.jira_base_url = base_url;
            // Never return plaintext token to frontend.
            config.jira_api_token = "••••••".to_string();
        } else {
            config.jira_api_token.clear();
        }
    }

    Ok(Some(config))
}

fn get_api_config_for_use() -> Result<Option<ApiConfig>, Box<dyn std::error::Error>> {
    // Get Ollama config from database
    let mut config = db::get_api_config()?.ok_or("No API configuration found")?;

    // Try to retrieve Jira credentials from keychain
    // We need to get the email from somewhere - for now, check if we have it in config
    if !config.jira_email.is_empty() {
        match keychain::get_jira_credentials(&config.jira_email) {
            Ok((base_url, token)) => {
                config.jira_base_url = base_url;
                config.jira_api_token = token;
            }
            Err(_) => {
                // Credentials not in keychain yet, return empty
                // This handles migration case
            }
        }
    }

    Ok(Some(config))
}

async fn test_jira_connection_impl() -> Result<String, Box<dyn std::error::Error>> {
    let config = get_api_config_for_use()?
        .ok_or("No API config found. Please configure Jira credentials first.")?;

    let client = JiraClient::new(
        config.jira_base_url,
        config.jira_email,
        config.jira_api_token,
    )?;

    let display_name = client.test_connection().await?;
    Ok(format!("Connected as {}", display_name))
}

// Helper function used by ticket commands
pub async fn get_jira_client(_app: AppHandle) -> Result<JiraClient, Box<dyn std::error::Error>> {
    let config = get_api_config_for_use()?
        .ok_or("No API config found. Please configure Jira credentials in Settings.")?;

    Ok(JiraClient::new(
        config.jira_base_url,
        config.jira_email,
        config.jira_api_token,
    )?)
}
