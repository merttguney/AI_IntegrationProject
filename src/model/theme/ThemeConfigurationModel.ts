import { BaseStrapiModel } from "@ibrahimbayer/strapi-http-toolkit";
import { StoreViewModel } from "../store/StoreViewModel";

// Google Fonts type definition that matches our font system
export type GoogleFontKey =
  | "inter"
  | "roboto"
  | "open-sans"
  | "lato"
  | "montserrat"
  | "nunito"
  | "poppins"
  | "manrope"
  | "playfair-display"
  | "merriweather"
  | "fira-code"
  | "custom";

export interface ThemeVariablesModel {
  // Brand colors that can be customized per store
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  foregroundColor?: string;
  // Semantic colors for feedback and status
  successColor?: string;
  warningColor?: string;
  errorColor?: string;
  infoColor?: string;
  // Store-specific configurations
  borderRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "full";
  fontFamily?: GoogleFontKey;
  fontSizeBase?: string; // e.g., '16px'
  fontWeightBase?: number | string; // e.g., 400, 'normal'
  // E-commerce specific theming
  buttonStyle?: "default" | "rounded" | "square" | "pill";
  cardStyle?: "flat" | "elevated" | "outlined";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  // Layout and spacing
  spacingUnit?: string; // e.g., '1rem'
  containerMaxWidth?: string; // e.g., '1280px'
  // Accessibility
  focusColor?: string;
  outlineColor?: string;
  // Versioning
  themeVersion?: string;
}

export interface ThemeConfigurationModel extends BaseStrapiModel {
  id: number;
  documentId: string;

  // Theme metadata
  name: string;
  description?: string;
  version: string;
  isActive: boolean;

  // Store association
  store_view?: StoreViewModel;

  // Theme variables (serialized as JSON in database)
  variables: ThemeVariablesModel;
}
