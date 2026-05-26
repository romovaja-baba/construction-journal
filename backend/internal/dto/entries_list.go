package dto

type EntriesListResponse struct {
	Items    []WorkEntryResponse `json:"items"`
	Total    int64               `json:"total"`
	Page     int                 `json:"page"`
	PageSize int                 `json:"page_size"`
}
