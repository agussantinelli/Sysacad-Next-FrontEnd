---
name: api-communication
description: Mandatory rules for API communication using the central http client in Sysacad-Next.
---

# API Communication Skill

This skill enforces the use of the centralized API client for all HTTP communications in the Sysacad-Next Frontend.

## Core Rule
**STRICTLY PROHIBITED**: Using native `fetch` or any other HTTP client other than the one defined in `src/app/core/api/axios.client.ts`.

## Rationale
The centralized client in `src/app/core/api/axios.client.ts` (based on `Axios`) automatically handles:
1.  **JWT Injection**: Adds the access token to the headers.
2.  **Auto-Refresh**: Manages token renewal when expired (401).
3.  **Base URL Configuration**: Centralizes the API URL.

## Implementation Guidelines
When creating or modifying a service in `src/app/core/services/` or feature-specific services:

1.  **Import the client**:
    ```typescript
    import { api } from '@core/api/axios.client';
    ```

2.  **Use Axios methods**:
    ```typescript
    // GET
    const data = await api.get('/api/endpoint');
    
    // POST
    const newRecord = await api.post('/api/endpoint', body);
    
    // PATCH / PUT
    const updated = await api.patch(`/api/endpoint/${id}`, body);
    
    // DELETE
    await api.delete(`/api/endpoint/${id}`);
    ```

3.  **Response Formats**:
    Always extract data from the standard wrapper if necessary, or type the full response.

## Verification
Any PR that includes direct `fetch` calls will be automatically rejected.
