export const classnames = (...args: Array<string | undefined | false | null>) => {
  return args.filter(Boolean).join(" ");
};
