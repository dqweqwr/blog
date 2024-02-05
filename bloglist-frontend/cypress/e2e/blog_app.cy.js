const BACKEND = Cypress.env("BACKEND")

describe("Blog app", function() {
  const user1 = {
    username: "testusername1",
    password: "testpassword1",
    name: "testuser1"
  }

  const user2 = {
    username: "testusername2",
    password: "testpassword2",
    name: "testuser2"
  }

  beforeEach(function() {
    cy.request("POST", `${BACKEND}/testing/reset`)
    cy.request("POST", `${BACKEND}/users`, user1)
    cy.request("POST", `${BACKEND}/users`, user2)

    cy.visit("")
  })

  it("login form is shown", function() {
    cy.contains("User must be logged in to see blog list")
  })

  describe("Login", function() {
    it("succeeds with correct credentials", function() {
      cy.get("#username").type(user1.username)
      cy.get("#password").type(user1.password)
      cy.get("button[type='submit']").click()
      cy.get(".success")
        .should("contain", `Logged in as ${user1.username}`)
    })

    it("fails with invalid credentials", function() {
      cy.get("#username").type(user1.username)
      cy.get("#password").type("wrongpassword")
      cy.get("button[type='submit']").click()
      cy.get(".error")
        .should("contain" ,"Invalid username or password")
        .and("have.css", "color", "rgb(114, 28, 36)")
    })
  })

  describe("When logged in", function() {
    const title = "I want off Mr. Golang's Wild Ride"
    const author = "fasterthanlime"
    const url = "https://fasterthanli.me/articles/i-want-off-mr-golangs-wild-ride"

    beforeEach(function() {
      cy.login(user1)
    });

    it("a blog can be created", function() {
      cy.contains("Add new blog")
        .click()

      cy.get("#title").type(title)
      cy.get("#url").type(url)
      cy.get("#author").type(author)
      cy.get("button[type='submit']").click()

      cy.contains(`title: ${title}`)
      cy.contains(`author: ${author}`)
    })

    describe("When a single blog listing exists", function() {
      beforeEach(function() {
        cy.createBlog({ title, url, author })
      })

      it("users can like a blog", function() {
        cy.contains(`title: ${title}`)
          .parent()
          .find("button")
          .click()
        cy.contains("likes: 0")
        cy.get("button")
          .contains(/^like$/)
          .click()
        cy.contains("likes: 1")
      })

      it("User can delete blog listings they have created", function() {
        cy.contains(`title: ${title}`)
          .parent()
          .find("button")
          .click()
        cy.get("button")
          .contains("delete")
          .click()
        cy.get(".success")
          .contains("\"I want off Mr. Golang's Wild Ride\" by fasterthanlime deleted")
      })

      it("User cannot delete blog listings they didnt create (delete button is hidden)", function() {
        cy.contains("Log out")
          .click()
        cy.login(user2)
        cy.contains(`title: ${title}`)
          .parent()
          .find("button")
          .click()
        cy.contains(`title: ${title}`)
          .parent()
          .should("not.include.text", "delete")
      })
    })

    describe("When multiple blog listings exist", function() {
      const blog1 = {
        title: "Mechanical watch",
        author: "Bartosz Ciechanowski",
        url: "https://ciechanow.ski/mechanical-watch/",
        likes: 6
      }

      const blog2 = {
        title: "How I cut GTA Online loading times by 70%",
        author: "t0st",
        url: "https://nee.lv/2021/02/28/How-I-cut-GTA-Online-loading-times-by-70/",
        likes: 4
      }

      const blog3 = {
        title: "Announcing the first SHA1 collision",
        author: "google",
        url: "https://security.googleblog.com/2017/02/announcing-first-sha1-collision.html",
        likes: 3
      }

      const blog4 = {
        title: "Bob's blog",
        author: "Bob",
        url: "bobsblog.com",
        likes: 2
      }

      beforeEach(function() {
        cy.createBlog(blog1)
        cy.createBlog(blog2)
        cy.createBlog(blog3)
        cy.createBlog(blog4)
      })

      it("blogs are ordered based on likes (most liked blogs on top, least liked on bottom)", function() {
        cy.get(".list-of-blogs > .blog-listing")
          .as("listOfBlogs")

        cy.get("@listOfBlogs")
          .eq(0)
          .as("blog1")
          .contains(`title: ${blog1.title}`)
        cy.get("@listOfBlogs")
          .eq(1)
          .as("blog2")
          .contains(`title: ${blog2.title}`)
        cy.get("@listOfBlogs")
          .eq(2)
          .as("blog3")
          .contains(`title: ${blog3.title}`)
        cy.get("@listOfBlogs")
          .eq(3)
          .as("blog4")
          .contains(`title: ${blog4.title}`)

        cy.get("@blog4")
          .find("button")
          .click()
        cy.get("@blog4")
          .find("button")
          .contains("like")
          .as("likeButton")

        cy.get("@likeButton")
          .click()
          .wait(800)
          .click()
          .wait(800)
          .click()
          .wait(800)
          .click()
          .wait(800)
          .click()
          .wait(800)

        cy.get("@listOfBlogs")
          .eq(0)
          .contains(`title: ${blog4.title}`)
      })
    })
  })
})
