import React from "react";
import "@testing-library/jest-dom/extend-expect"
import userEvent from "@testing-library/user-event"
import { render } from "@testing-library/react";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  let container
  const createBlog = jest.fn()

  beforeEach(() => {
    container = render(
      <BlogForm
        createBlog={createBlog}
      />
    ).container
  })

  test("Form works as intended", async () => {
    const user = userEvent.setup()
    const titleInput = container.querySelector("#title")
    const urlInput = container.querySelector("#url")
    const authorInput = container.querySelector("#author")
    const submitButton = container.querySelector("button[type='submit']")

    const title = "I want off Mr. Golang's Wild Ride"
    const author = "fasterthanlime"
    const url = "https://fasterthanli.me/articles/i-want-off-mr-golangs-wild-ride"

    await user.type(titleInput, title)
    await user.type(urlInput, url)
    await user.type(authorInput, author)

    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    const blogFormData = createBlog.mock.calls[0][0]
    expect(blogFormData.title).toBe(title)
    expect(blogFormData.url).toBe(url)
    expect(blogFormData.author).toBe(author)
  })
})
