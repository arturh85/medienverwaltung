"""The application's model objects"""
import sqlalchemy as sa
from sqlalchemy import orm

from medienverwaltungweb.model import meta
from medium import Medium, media_table
from persons import Person, persons_table
from persons import RelationType, relation_types_table
from persons import MediaToAsin, media_to_asin_table

def init_model(engine):
    """Call me before using any of the tables or classes in the model"""
    ## Reflected tables must be defined and mapped here
    #global reflected_table
    #reflected_table = sa.Table("Reflected", meta.metadata, autoload=True,
    #                           autoload_with=engine)
    #orm.mapper(Reflected, reflected_table)
    #
    meta.Session.configure(bind=engine)
    meta.engine = engine

orm.mapper(Medium, media_table)
orm.mapper(RelationType, relation_types_table)
orm.mapper(Person, persons_table)
orm.mapper(MediaToAsin, media_to_asin_table)
