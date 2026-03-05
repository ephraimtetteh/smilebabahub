import { parseCookies } from "nookies";

export const getServerSideProps = async (ctx: any) => {
  const cookies = parseCookies(ctx);

  const token = cookies.accessToken;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
