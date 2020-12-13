module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:3000/",
        ws: true,
        changeOrigin: true,
      },
      "^/room": {
        target: "http://localhost:3000/",
        ws: true,
        changeOrigin: true,
      },
    },
  },
}
