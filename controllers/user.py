from model.user import User

USER_FIELDS = ['id', 'name', 'password']


def get_all_users():
    """
    Get list of all records
    """
    all_users = User.query.all()
    users = []
    for user in all_users:
        act = {k: v for k, v in user.__dict__.items() if k in USER_FIELDS}
        users.append(act)
    return users


def add_user(data):
    """
    Add new actor
    """
    try:
        new_record = User.create(**data)
        new_user = {k: v for k, v in new_record.__dict__.items() if k in USER_FIELDS}
        return new_user
    except Exception as err:
        err = str(err)
        return err


def get_user_by_id(data):
    """
    Get record by id
    """
    if 'id' in data.keys():
        try:
            row_id = int(data['id'])
        except Exception:
            err = 'Id must be integer'
            return err

        obj = User.query.filter_by(id=row_id).first()
        try:
            actor = {k: v for k, v in obj.__dict__.items() if k in USER_FIELDS}
        except Exception:
            err = 'Record with such id does not exist'
            return err

        return actor

    err = 'No id specified'
    return err


def delete_user(data):
    if 'id' in data.keys():
        try:
            row_id = int(data['id'])
        except Exception:
            err = 'Id must be integer'
            return err
    else:
        err = 'No id specified'
        return err
    try:
        User.delete(row_id)
        msg = 'Record successfully deleted'
        return msg
    except Exception:
        err = 'Error'
        return err


def get_user_by_name(data):

    try:
        obj = User.query.filter_by(name=data['name']).first()
        actor = {k: v for k, v in obj.__dict__.items() if k in USER_FIELDS}
    except Exception:
        return -1

    return actor
