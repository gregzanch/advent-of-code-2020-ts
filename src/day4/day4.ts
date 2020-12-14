//@ts-nocheck
export {};
(() => {
  const rules = {
    byr: (value: string) => !!String(value).match(/^\d{4}$/gim) && Number(value) >= 1920 && Number(value) <= 2002,
    iyr: (value: string) => !!String(value).match(/^\d{4}$/gim) && Number(value) >= 2010 && Number(value) <= 2020,
    eyr: (value: string) => !!String(value).match(/^\d{4}$/gim) && Number(value) >= 2020 && Number(value) <= 2030,
    hgt: (value: string) => {
      const val = String(value).trim(); //?
      const num = Number(val.replace(/in|cm/gim, "").trim()); //?
      const cm = val.match(/^\d{3}cm$/gim) && num >= 150 && num <= 193; //?
      const inch = val.match(/^\d{2}in$/gim) && num >= 59 && num <= 76; //?
      return !!(cm || inch);
    },
    hcl: (value: string) => {
      let val = String(value);
      return !!val.match(/^\#[0-9a-f]{6}$/gim);
    },
    ecl: (value: string) => {
      return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(value);
    },
    pid: (value: string) => {
      return !!String(value).match(/^[0-9]{9}$/gim);
    },
    cid: (value: string) => {
      return true;
    },
  };

  const validateField = (field: any[]) => {
    const id = field[0].trim() as keyof typeof rules;
    const value = field[1];
    const valid = rules[id](value);
    return valid;
  };

  const getValid = (str: string) => {
    return str.split("\n\n").map((x) => {
      const fields = x.split(/\s+/gim).map((y) => y.split(":"));
      const validFields = fields.filter((x) => validateField(x));
      return validFields;
    });
  };

  const keys = ["ecl", "eyr", "byr", "hcl", "pid", "iyr", "hgt"].sort();
  const keystr = keys.join("");

  const hasAllFields = (fields: any[]) =>
    fields
      .map((x: any[]) => x[0])
      .filter((x: string) => x !== "cid")
      .sort()
      .join("") === keystr;

  const solution = getValid(input).filter(hasAllFields).length; //?
})();
