# Experimental features

Some features of LinkStash is considered experimental. For some reason or another, there are 
considered less feature complete or stable than their normal counterparts. There are nonetheless put 
into the application to either gather feedback or as a stop gap until a more complete solution replaces it.

This section will list down all the experimental features and the reason they are included as experimental (instead of as normal feature or not at all) and the plans for maturing or replacing them.

## sqlite support

[docs](sqlite.md)

In certain environments, I **don’t** have complete control over the system, or I **can’t** (or **don’t want to**) install either **Docker or MySQL**. However, I still want to be able to run **LinkStash** for development. Supporting **SQLite** helps in these cases, as it allows me to run the database without additional dependencies.

### Reasons for Being Experimental
- Some queries **don’t work** with SQLite, particularly **generated columns**.
- I've implemented **workarounds as I encountered issues**, but **haven’t tested them extensively**.
- **Requires extra setup on Windows**.
- **Hasn’t been thoroughly tested**—it’s primarily used to support development.


### Plans for maturing / replacing
- **None.** This feature, and any duct tapes that holds it together,  will stay as long as it remains useful. If maintaining it becomes too much effort vs the convinience gained, we will **abandon it**.
- Use it as a workaround to developing in restricted environments. Do **NOT** daily drive LinkStash with sqlite.

---

## Bulk Archive

Bulk archiving is **buggy**—mainly because **archiving itself is buggy**. It handles **article-like content** fairly well (which is its main use case), but it **struggles** with other content types, especially anything that **isn’t basic HTML**.

With **normal archiving**, you can at least see if something **fails** and get **feedback** when an issue occurs. However, in **bulk archiving**, errors happen in the background, making its behavior **unclear and inconsistent**.

We plan to **improve the base archiving system** to support more content formats and general improvements. Until then, **bulk archiving remains experimental**. If you understand the type of content it works well with and stick to that, it functions **reasonably well**.

### Reasons for Being Experimental
- **Limited use cases** where it works well.
- Since there are **already plans to improve archiving**, investing too much effort here would lead to **unnecessary rework**.

### Plans for Maturing / Replacing
- We will **first improve the core archiving system**. Once it becomes **more robust**, we will revisit **bulk operations**.
