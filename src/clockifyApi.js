const CLOCKIFY_API_KEY = process.env.CLOCKIFY_API_KEY;
const CLOCKIFY_API_URL = process.env.CLOCKIFY_API_URL;
const CLOCKIFY_LEGACY_API_URL = process.env.CLOCKIFY_LEGACY_API_URL;

export async function query(endpoint, url = CLOCKIFY_API_URL) {
    const headers = { 'X-Api-Key': CLOCKIFY_API_KEY, 'Content-Type': 'application/json' };
    const response = await fetch(`${url}${endpoint}`, { headers });
    const json = await response.json();

    return json;
}

export async function getCurrentlyLoggedInUser() {
    return query('/user/');
}

export async function get50MostRecentTimeEntries(workspaceId, userId) {
    // returns 50 most recent time entries (latest first)
    return query(`/workspaces/${workspaceId}/timeEntries/user/${userId}`, CLOCKIFY_LEGACY_API_URL);
}

export async function findProjectsOnWorkspace(workspaceId) {
    const useLegacyApi = true;
    return query(`/workspaces/${workspaceId}/projects/`, CLOCKIFY_LEGACY_API_URL);
}