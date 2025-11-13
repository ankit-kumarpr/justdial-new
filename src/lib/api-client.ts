
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function refreshToken(token: string) {
    // This check prevents server-side code from accessing localStorage
    if (typeof window === 'undefined') {
        console.error("Token refresh cannot be performed on the server.");
        return null;
    }

    try {
        const res = await fetch(`${apiBaseUrl}/api/auth/refresh-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: token }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.message || 'Failed to refresh token.');
        }
        return data.data; // Should contain new accessToken and user object
    } catch (error) {
        console.error("Refresh token failed:", error);
        // Clear tokens and force re-login only on the client-side
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event("storage"));
        // Use a return value to signal failure
        return null;
    }
}

export async function apiFetch(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {},
    isFormData: boolean = false
) {
    if (!apiBaseUrl) {
        throw new Error('Backend API URL is not configured.');
    }

    const headers: Record<string, string> = {};
    
    // Only set Content-Type if it's not FormData
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const requestOptions: RequestInit = {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {}),
        },
    };
    
    if (isFormData && requestOptions.headers) {
        delete (requestOptions.headers as Record<string, string>)['Content-Type'];
    }

    let response = await fetch(`${apiBaseUrl}${endpoint}`, requestOptions);

    if ((response.status === 401 || response.status === 403) && typeof window !== 'undefined') {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (refreshTokenValue) {
            const newTokens = await refreshToken(refreshTokenValue);
            if (newTokens && newTokens.accessToken) {
                localStorage.setItem('accessToken', newTokens.accessToken);
                if (newTokens.user) {
                  localStorage.setItem('user', JSON.stringify(newTokens.user));
                }
                window.dispatchEvent(new Event("storage"));

                const newHeaders = { ...requestOptions.headers };
                (newHeaders as Record<string, string>)['Authorization'] = `Bearer ${newTokens.accessToken}`;
                response = await fetch(`${apiBaseUrl}${endpoint}`, { ...requestOptions, headers: newHeaders });
            } else {
                // Refresh token failed, redirect to login
                window.location.href = '/login';
                // Throw an error to stop further execution
                throw new Error("Session expired. Please log in again.");
            }
        } else {
             // No refresh token, log out and redirect
             localStorage.removeItem('accessToken');
             localStorage.removeItem('refreshToken');
             localStorage.removeItem('user');
             window.dispatchEvent(new Event("storage"));
             window.location.href = '/login';
             throw new Error("Authentication required. Please log in.");
        }
    }
    
    const responseText = await response.text();
    let result;
    try {
        result = JSON.parse(responseText);
    } catch (e) {
        console.error("Failed to parse JSON response. Server returned:", responseText);
        throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
    }


    if (!response.ok) {
        throw new Error(result.error || result.message || `API request failed with status ${response.status}`);
    }
    
    return result;
}
