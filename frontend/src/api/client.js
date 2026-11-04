const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "").replace(/\/api$/, "") + "/api";
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const request = async (path, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const hasJsonBody = !isFormData && options.body !== undefined;
  const headers = {
    ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed.");
    error.status = response.status;
    throw error;
  }

  return data;
};

export const api = {
  getSiteData: () => request("/site"),
  recordVisit: () =>
    request("/visits", {
      method: "POST"
    }),
  loginAdmin: (body) =>
    request("/auth/login", {
      method: "POST",
      body
    }),
  loginTeam: (body) =>
    request("/auth/team-login", {
      method: "POST",
      body
    }),
  getTeamContent: (token) => request("/team/content", { headers: { Authorization: `Bearer ${token}` } }),
  getTeamMe: (token) => request("/team/me", { headers: { Authorization: `Bearer ${token}` } }),
  changeTeamPassword: (body, token) => request("/team/change-password", { method: "POST", body, headers: { Authorization: `Bearer ${token}` } }),
  updateTeamSection: (section, value, token) =>
    request(`/team/content/${section}`, { method: "PUT", body: { value }, headers: { Authorization: `Bearer ${token}` } }),
  uploadTeamImageAsset: (file, token) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/team/uploads/image", { method: "POST", body: formData, headers: { Authorization: `Bearer ${token}` } });
  },
  uploadTeamDocumentAsset: (file, token) => {
    const formData = new FormData();
    formData.append("document", file);
    return request("/team/uploads/document", { method: "POST", body: formData, headers: { Authorization: `Bearer ${token}` } });
  },
  getTeamSubmissions: (token) => request("/team/submissions", { headers: { Authorization: `Bearer ${token}` } }),
  deleteTeamSubmission: (type, id, token) => request(`/team/submissions/${type}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
  getTeamPermissions: (token) => request("/admin/team-permissions", { headers: { Authorization: `Bearer ${token}` } }),
  getTeamUsers: (token) => request("/admin/team-users", { headers: { Authorization: `Bearer ${token}` } }),
  createTeamUser: (body, token) => request("/admin/team-users", { method: "POST", body, headers: { Authorization: `Bearer ${token}` } }),
  updateTeamUser: (id, body, token) => request(`/admin/team-users/${id}`, { method: "PATCH", body, headers: { Authorization: `Bearer ${token}` } }),
  resetTeamPassword: (id, token) => request(`/admin/team-users/${id}/reset-password`, { method: "POST", headers: { Authorization: `Bearer ${token}` } }),
  deleteTeamUser: (id, token) => request(`/admin/team-users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }),
  getAuditLogs: (token) => request("/admin/audit-logs", { headers: { Authorization: `Bearer ${token}` } }),
  updateSection: (section, value, token) =>
    request(`/admin/content/${section}`, {
      method: "PUT",
      body: { value },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  uploadImageAsset: (file, token) => {
    const formData = new FormData();
    formData.append("image", file);

    return request("/admin/uploads/image", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
  uploadDocumentAsset: (file, token) => {
    const formData = new FormData();
    formData.append("document", file);

    return request("/admin/uploads/document", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((error) => {
      if (/404/.test(error.message || "") || /not found/i.test(error.message || "")) {
        throw new Error("Document upload endpoint not found (404). Restart backend so /api/admin/uploads/document is active.");
      }
      throw error;
    });
  },
  getSubmissions: (token) =>
    request("/admin/submissions", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  deleteSubmission: (type, id, token) =>
    request(`/admin/submissions/${type}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),
  submitForm: (type, body) =>
    request(`/forms/${type}`, {
      method: "POST",
      body
    }),
  submitInternRegistration: (body) =>
    request("/forms/intern", {
      method: "POST",
      body
    }),
  submitTestimonial: (body) =>
    request("/forms/testimonial", {
      method: "POST",
      body
    }),
  submitIncubateeProfile: (body) =>
    request("/forms/incubatee-profile", {
      method: "POST",
      body
    })
};
