const dev = process.env.NODE_ENV === "development";

export default {
  ...(dev
    ? { rewrites: async () => [{ source: "/api/:path*", destination: "http://backend:8080/api/:path*" }] }
    : { output: "export" }),
};
