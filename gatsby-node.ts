import type {GatsbyNode} from "gatsby"
import {createFilePath} from "gatsby-source-filesystem";
import {getNode} from "gatsby/dist/datastore";
import path from "path";
import MdxConnection = Queries.MdxConnection;


type AllMdxResponse = {
  errors?: any
  data?: { allMdx: MdxConnection }
}

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({
                                                                 node,
                                                                 actions
                                                               }) => {
  const {createNodeField} = actions
  if (node.internal.type === `Mdx`) {
    const postSlug = createFilePath({
      node,
      getNode,
      basePath: `content/blog`,
      trailingSlash: true,
    })
    createNodeField({
      node,
      name: `slug`,
      value: `/blog${postSlug}`,
    });
  }
}

export const createPages: GatsbyNode["createPages"] = async ({graphql, actions}) => {
  const {createPage} = actions
  const blogTemplate = path.resolve("./src/components/blog.tsx")
  const result: AllMdxResponse = await graphql<{ allMdx: MdxConnection }>(`
    query {
      allMdx {
        edges {
          node {
            internal {
              contentFilePath
            }
            fields{
              slug
            }
          }
        }
      }
    }
  `)
  result.data?.allMdx.edges.forEach(e => {
    const component = `${blogTemplate}?__contentFilePath=${e.node.internal.contentFilePath}`;
    const slug = e.node.fields?.slug;
    if (slug != null) {
      createPage({
        component: component,
        path: slug
      })
    }
  })
}