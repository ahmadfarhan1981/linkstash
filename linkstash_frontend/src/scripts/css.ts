/**
 * Will generate a CSS class name that will apply both the global css and also the style modules's css class
 *
 * @param styles the imported style module
 * @param name name of the css class
 * @returns a string that has base css class and also the style's version of the class if available.
 */
export function generateClassNames(styles: any, name: string): string {
    return styles[name] ? styles[name].concat(" ").concat(name) : name;
  }