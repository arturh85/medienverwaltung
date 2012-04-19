package backend

class MediaTypeService {

    def initializeDefaultMediaTypes() {
        def books = MediaType.findByName("Books");

        if(!books) {
            books = new MediaType(name: "Books", amazonSearchIndex: "Book");
            books.save()
        }

        def dvds = MediaType.findByName("Books");

        if(!dvds) {
            dvds = new MediaType(name: "DVDs", amazonSearchIndex: "DVD");
            dvds.save()
        }
    }
}
