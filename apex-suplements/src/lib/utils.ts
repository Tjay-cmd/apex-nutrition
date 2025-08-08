import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency in South African Rand
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount)
}

/**
 * Format currency excluding tax display
 */
export function formatCurrencyExTax(amount: number): string {
  const formatted = formatCurrency(amount)
  return `${formatted} Ex Tax: ${formatCurrency(amount * 0.87)}`
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Get sport-specific color
 */
export function getSportColor(sport: string): string {
  const sportColors: Record<string, string> = {
    rugby: 'text-emerald-600',
    cycling: 'text-blue-600',
    swimming: 'text-cyan-600',
    bodybuilding: 'text-orange-600',
    endurance: 'text-purple-600',
    default: 'text-apex-red'
  }

  return sportColors[sport.toLowerCase()] || sportColors.default
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Check if product is on sale
 */
export function isOnSale(originalPrice: number, salePrice: number): boolean {
  return salePrice < originalPrice
}