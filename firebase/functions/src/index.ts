import * as functions from 'firebase-functions'
import { DialogflowApp, Responses } from 'actions-on-google'

export const demoHandler = functions.https.onRequest((request, response) => {
    const app = new DialogflowApp({request, response})
    const map = new Map()
    map.set('input.demo', handleInputDemo)
    map.set('input.demo.option', handleInputDemoOption)
    app.handleRequest(map)
})

function handleInputDemo(app: DialogflowApp) {
    return app.askWithCarousel(
        // The input prompt. 
        {
            speech: 'Here are option A, option B and option C. To which one shpuld I react?',
            displayText: 'Here are some options. To which option should I react?'
        },
        // The carousel.
        app.buildCarousel()
            .addItems(['A',  'B', 'C']
                // Creates the option items.
                // We'll write `buildOptionItem` in the next step!
                .map(aString => buildOptionItem(app, aString))
            ))
}

function buildOptionItem(app: DialogflowApp, aString: string): Responses.OptionItem {
    // Provide a key which is unique to each option.
    // And synonyms that the user can say alternativly to the title
    return app.buildOptionItem(`KEY_${aString}`, aString)
        .setTitle(`Option ${aString}`)
        // Description and image are optional.
        .setDescription(`Description for ${aString}`)
        .setImage('https://example.com/image.jpg', 'An image')
}

function handleInputDemoOption(app: DialogflowApp) {
    switch (app.getSelectedOption()) {
        case 'KEY_A': 
            return app.tell('Option A is a solid choice.')
        default:
            return app.tell('I would prefer Option A.')
    }
}

