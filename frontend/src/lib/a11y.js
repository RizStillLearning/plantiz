// Join the ids of a control's hint and error for aria-describedby.
export const describedBy = (...ids) => ids.filter(Boolean).join(' ') || undefined
