export class Enum<T> {
    public constructor(public readonly value: T) {}
  
    /** toString - converts the enum value to string
     * @returns {string}
     */
    public toString(): string {
      return (this.value as any).toString();
    }
  }
  