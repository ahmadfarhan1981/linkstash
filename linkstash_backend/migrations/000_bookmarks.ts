// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'
import { title } from 'process'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('bookmarks', (table) => {
    table.increments('id')

    table.string('url')
    table.string('description')
    table.bigint('created')
    table.string('title')

  })

  await knex('bookmarks').insert([{
    url: 'https://reddit.com',
    title: 'Reddit',
    description: "Reddit used to be the front page of the internet",
    created: Date.now(),
  },
  {
    url: 'https://google.com',
    title: 'Google',
    description: "Google used to do no evil",
    created: Date.now(),
  },
]
  
)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('bookmarks')
}
