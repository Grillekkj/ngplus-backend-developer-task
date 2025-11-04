export function toCamelCase(input: string): string {
  const words = input.replaceAll(/[^a-zA-Z0-9]/g, ' ').split(/[\s_]+/);

  return words
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
}

export function toPascalCase(input: string): string {
  const words = input.replaceAll(/[^a-zA-Z0-9]/g, ' ').split(/[\s_]+/);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export function toKebabCase(input: string): string {
  return input.replaceAll(/[\s_]+/g, '-').toLowerCase();
}

export function toCapitalCase(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
