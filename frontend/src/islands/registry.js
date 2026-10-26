// Dynamic imports keep each island, and React, out of pages that don't use it.
export const islands = {
  LoginForm: () => import('./LoginForm.jsx'),
  SignupForm: () => import('./SignupForm.jsx'),
  RecommendForm: () => import('./RecommendForm.jsx'),
  IdentifyForm: () => import('./IdentifyForm.jsx'),
}
