export default class Date {
  #year;
  #month;
  #day;

  constructor(year, month, day) {
    this.#year = year;
    this.#month = month;
    this.#day = day;
  }

  get year() {
    return this.#year;
  }

  get month() {
    return this.#month;
  }

  get day() {
    return this.#day;
  }
}
