import router from "next/router";

export const goto = async (url: string) => {
  await router.push({
    pathname: url,
  });
};
