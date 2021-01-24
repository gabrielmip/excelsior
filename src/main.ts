import App from './pages/Home.svelte';

const app = new App({
  target: document.body,
  props: {},
});

export default app;

// @ts-ignore
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept();
  // @ts-ignore
  import.meta.hot.dispose(() => {
    app.$destroy();
  });
}
