import { Enum } from './lunona.enum';

export class LandingPage extends Enum<string> {
  
  /** male page */
  public static readonly LANDING_MALE: Enum<string> = new Enum("landing-male");

  /** female page */
  public static readonly LANDING_FEMALE: Enum<string> = new Enum("landing-female");

  /** language select */
  public static readonly ENGLISH: Enum<string> = new Enum("English");

  /** language select */
  public static readonly GREEK: Enum<string> = new Enum("Greek");

  /** language select */
  public static readonly RUSSIAN: Enum<string> = new Enum("Russian");

  /** language select */
  public static readonly BULGARIAN: Enum<string> = new Enum("Bulgarian")

}