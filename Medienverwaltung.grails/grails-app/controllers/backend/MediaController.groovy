package backend

import grails.converters.JSON

class MediaController {
    def books() {
        if(request.postData) {
            log.error("ADDING book with isbn '${request.postData}'")

            def book = new Media(mediaType: MediaType.findByName("Books"))
            book.isbn = postData
            book.save(flush: true)
        }

        withFormat {
            json {
                def books = Media.findByMediaType(MediaType.findByName("Books"))

                def jsonResult = books.collect { book ->
                    [
                        title: book.title
                    ]
                }


                if(params.callback) {
                    render "${params.callback}(${jsonResult as JSON})"
                } else {
                    render jsonResult as JSON
                }
            }
        }
    }

    def mediaTypes() {
        withFormat {
            json {
                def mediaTypes = MediaType.list();

                def jsonResult = mediaTypes.collect { mediaType ->
                    [
                        name: mediaType.name
                    ]
                }

                if(params.callback) {
                    render "${params.callback}(${jsonResult as JSON})"
                } else {
                    render jsonResult as JSON
                }
            }
        }
    }

    def index() { }
}
