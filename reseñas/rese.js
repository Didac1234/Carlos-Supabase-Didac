// Fallback data (empty defaults, all data now fetches from Supabase)
export const Reseñas = {
  query: {
    where: "",
    checkin: "",
    checkout: "",
    guests: "",
  },
  totalResults: 0,
  filters: {
    budgetRanges: [],
    popularFilters: [],
    activities: [],
  },
  results: [],
};