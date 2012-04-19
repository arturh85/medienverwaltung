package backend

class MediaType {
    Long id
    String name
    String amazonSearchIndex

    static constraints = {
        name(blank: false)
        amazonSearchIndex(blank: false)
    }
}
