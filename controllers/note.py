from model.note import Note

NOTE_FIELDS = ['id', 'checked', 'todo', 'user_id']


def get_all_notes():
    all_notes = Note.query.all()
    notes = []
    for note in all_notes:
        act = {k: v for k, v in note.__dict__.items() if k in NOTE_FIELDS}
        notes.append(act)
    return notes


def get_notes_by_user_id(user_id):
    all_notes = Note.query.filter_by(user_id=user_id)
    notes = []
    for note in all_notes:
        act = {k: v for k, v in note.__dict__.items() if k in NOTE_FIELDS}
        notes.append(act)
    return notes


def add_note(data):
    try:
        new_record = Note.create(**data)
        new_note = {k: v for k, v in new_record.__dict__.items() if k in NOTE_FIELDS}
        return new_note
    except Exception as err:
        err = str(err)
        return err


def get_note_by_id(data):
    if 'id' in data.keys():
        try:
            row_id = int(data['id'])
        except Exception:
            err = 'Id must be integer'
            return err

        obj = Note.query.filter_by(id=row_id).first()
        try:
            actor = {k: v for k, v in obj.__dict__.items() if k in NOTE_FIELDS}
        except Exception:
            err = 'Record with such id does not exist'
            return err

        return actor


    err = 'No id specified'
    return err


def update_note(data):
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
        upd_record = Note.update(row_id, **data)
        upd_note = {k: v for k, v in upd_record.__dict__.items() if k in NOTE_FIELDS}
        return upd_note
    except Exception:
        err = 'Error'
        return err


def delete_note(data):
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
        Note.delete(row_id)
        msg = 'Record successfully deleted'
        return msg
    except Exception:
        err = 'Error'
        return err
