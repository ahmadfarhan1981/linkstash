# SQLite Support (Experimental)

Starting from **v1.1**, Linkstash includes **experimental** support for SQLite. This feature is still under development, and some functionality may be incomplete or unstable. Please report any issues you encounter.

I am still debating whether to fully support SQLite. For now, I've done some basic work to make it functional but haven't extensively tested it. Issues related to SQLite will also be evaluated based on the effort required to maintain full compatibility with MySQL.

## Enabling SQLite Support

To enable SQLite, set the following environment variable **before starting the backend**:

You can do this by adding/editing this line in your `.env` file:

```
DB_TYPE=sqlite
```

Manually setting the environment variable:
```sh
export DB_TYPE=sqlite  # Linux/macOS
set DB_TYPE=sqlite      # Windows (Command Prompt)
```

## SQLite File Location

You can specify the location of the database file using the `DB_FILE` environment variable:

```
DB_FILE=database.sqlite
```

## Notes
- This feature is in **early-stage testing** and may have **performance or stability issues**.
- Some advanced database features may not work as expected.

> I decided to add SQLite support because MySQL can be a heavy requirement in some cases. However, I do not want to fully commit to supporting SQLite long-term, as I may introduce future features requiring more advanced database functionality that SQLite may not fully support. As of now, I don't foresee any immediate issues, but this may change depending on project needs.