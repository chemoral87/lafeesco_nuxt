// https://codesandbox.io/s/github/manniL/nuxt-decouple-and-organize-api-calls?file=/plugins/repository.js:0-446
// https://blog.lichter.io/posts/nuxt-api-call-organization-and-decoupling/
import createRepository from '@/api/repository'
export default (ctx, inject) => {
  // inject the repository in the context (ctx.app.$repository)
  // And in the Vue instances (this.$repository in your components)
  
  const repositoryWithAxios = createRepository(ctx.$axios)
  inject('postRepository', repositoryWithAxios('/posts'))
  inject('roleRepository', createRepository(ctx.$axios)('/roles'))

  // You can reuse the repositoryWithAxios object:
  // inject("userRepository", repositoryWithAxios('/users'));
}