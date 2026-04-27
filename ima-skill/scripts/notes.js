const { imaApi } = require('../ima_api.cjs');

async function createNote(content) {
    const resp = await imaApi('openapi/note/v1/import_doc', {
        content_format: 1,
        content: content
    });
    const data = JSON.parse(resp);
    if (data.code !== 0) {
        throw new Error(data.msg);
    }
    return data.data.note_id;
}

async function appendToNote(noteId, content) {
    const resp = await imaApi('openapi/note/v1/append_doc', {
        note_id: noteId,
        content_format: 1,
        content: content
    });
    return JSON.parse(resp);
}

async function getNoteContent(noteId, targetFormat = 0) {
    const resp = await imaApi('openapi/note/v1/get_doc_content', {
        note_id: noteId,
        target_content_format: targetFormat
    });
    return JSON.parse(resp);
}

async function searchNotes(query, searchType = 0) {
    const resp = await imaApi('openapi/note/v1/search_note', {
        search_type: searchType,
        query_info: { title: query },
        start: 0,
        end: 20
    });
    return JSON.parse(resp);
}

async function listNotes(folderId = null, sortType = 0) {
    const body = {
        sort_type: sortType,
        cursor: "",
        limit: 20
    };
    if (folderId) {
        body.folder_id = folderId;
    }
    const resp = await imaApi('openapi/note/v1/list_note', body);
    return JSON.parse(resp);
}

async function listNotebooks() {
    const resp = await imaApi('openapi/note/v1/list_notebook', {
        cursor: "0",
        limit: 20
    });
    return JSON.parse(resp);
}

module.exports = {
    createNote,
    appendToNote,
    getNoteContent,
    searchNotes,
    listNotes,
    listNotebooks
};
