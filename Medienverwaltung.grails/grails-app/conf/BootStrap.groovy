class BootStrap {
    def mediaTypeService

    def init = { servletContext ->
        mediaTypeService.initializeDefaultMediaTypes()
    }
    def destroy = {
    }
}
