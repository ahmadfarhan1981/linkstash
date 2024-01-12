module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules:{
        'type-enum': [2, 'always', [            
            'build',
            'chore',
            'ci',
            'docs',
            'feat',
            'fix',
            'perf',
            'refactor',
            'revert',
            'style',
            'test'
          ]],
          
    },
    ignores: [
        (commit) =>{ commit.includes('WIP') },
        (commit) =>{ commit === 'WIP' },
    ],
    defaultIgnores: true,
}
