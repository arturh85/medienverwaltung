package backend

class Media {
    Long id
    String title
    MediaType mediaType
    String isbn

    byte[] imageData
    byte[] thumbnailData

    Date dateCreated = new Date()
    Date lastUpdated = new Date()

    //User createdBy

    static constraints = {
        title(size: 1..100)
        isbn(size: 1..15)
    }
}
