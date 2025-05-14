import * as Icons from 'lucide-react';

// Named exports for specific icons
export const { Languages, Building2, UserCog } = Icons;
export const Hand = Icons.HandMetal;

// Utility function to get any icon by name
export function getIcon(iconName) {
  return Icons[iconName] || Icons.Smile;
}

// Export all icons for convenience
export { Icons };