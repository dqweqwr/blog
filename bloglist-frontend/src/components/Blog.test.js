import React from "react";
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

describe("<Blog /> component", () => {
  let container
  const blog = {
    "title": "npm audit: Broken by Design",
    "author": "Dan Abramov",
    "url": "https://overreacted.io/npm-audit-broken-by-design/",
    "likes": 8,
    "user": {
      "username": "aaron1",
      "name": "aaron",
      "id": "64ae85d795249e98138e1687"
    },
    "id": "64ae861195249e98138e1691"
  }
  const updateLikes = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        updateLikes={updateLikes}
      />
    ).container
  })

  test("renders title and author, but not likes or url", () => {
    const title = screen.getByText(
      blog.title, { exact: false }
    )
    expect(title).toBeDefined()

    const author = screen.getByText(
      blog.author, { exact: false }
    )
    expect(author).toBeDefined()

    const likes = screen.queryByText(
      blog.likes, { exact: false }
    )
    expect(likes).toBeNull()

    const url = screen.queryByText(
      blog.url, { exact: false }
    )
    expect(url).toBeNull()
  })

  test("unhides likes and url when view button is clicked", async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText("view")
    await user.click(viewButton)

    const title = screen.getByText(
      blog.title, { exact: false }
    )
    expect(title).toBeDefined()

    const author = screen.getByText(
      blog.author, { exact: false }
    )
    expect(author).toBeDefined()

    const likes = screen.getByText(
      blog.likes, { exact: false }
    )
    expect(likes).toBeDefined()

    const url = screen.getByText(
      blog.url, { exact: false }
    )
    expect(url).toBeDefined()
  })

  test("when like button is clicked twice, updateLikes event handler is called twice", async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText("view")
    await user.click(viewButton)

    const likeButton = screen.getByText("like")
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateLikes.mock.calls).toHaveLength(2)
  })
})
