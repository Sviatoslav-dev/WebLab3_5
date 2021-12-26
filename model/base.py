from core import db


def commit(obj):
    db.session.add(obj)  # pylint: disable=no-member
    db.session.commit()  # pylint: disable=no-member
    db.session.refresh(obj)  # pylint: disable=no-member
    return obj


class Model:
    @classmethod
    def create(cls, **kwargs):
        obj = cls(**kwargs)
        return commit(obj)

    @classmethod
    def update(cls, row_id, **kwargs):
        obj = cls.query.filter_by(id=row_id).first()  # pylint: disable=no-member
        for key in kwargs:
            if key != 'id':
                setattr(obj, key, kwargs[key])
        return commit(obj)

    @classmethod
    def delete(cls, row_id):
        print('r  ', row_id)
        obj = cls.query.filter_by(id=row_id).delete()  # pylint: disable=no-member
        db.session.commit()
        return obj

    @classmethod
    def clear_relations(cls, row_id):
        obj = cls.query.filter_by(id=row_id).first()  # pylint: disable=no-member
        if cls.__name__ == 'User':
            obj.notes.clear()
        return commit(obj)
