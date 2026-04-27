const { imaApi } = require('../ima_api.cjs');

async function searchKnowledgeBases(query = "") {
    const resp = await imaApi('openapi/wiki/v1/search_knowledge_base', {
        query: query,
        cursor: "",
        limit: 20
    });
    return JSON.parse(resp);
}

async function getKnowledgeBase(kbId) {
    const resp = await imaApi('openapi/wiki/v1/get_knowledge_base', {
        ids: [kbId]
    });
    return JSON.parse(resp);
}

async function getKnowledgeList(kbId, folderId = null) {
    const body = {
        knowledge_base_id: kbId,
        cursor: "",
        limit: 50
    };
    if (folderId) {
        body.folder_id = folderId;
    }
    const resp = await imaApi('openapi/wiki/v1/get_knowledge_list', body);
    return JSON.parse(resp);
}

async function getFolders(kbId, folderId = null) {
    const data = await getKnowledgeList(kbId, folderId);
    return data.data.knowledge_list.filter(item => item.media_type === 99);
}

async function addNoteToKnowledgeBase(noteId, title, kbId, folderId = null) {
    const body = {
        media_type: 11,
        note_info: { content_id: noteId },
        title: title,
        knowledge_base_id: kbId
    };
    if (folderId) {
        body.folder_id = folderId;
    }
    const resp = await imaApi('openapi/wiki/v1/add_knowledge', body);
    return JSON.parse(resp);
}

async function searchKnowledge(query, kbId) {
    const resp = await imaApi('openapi/wiki/v1/search_knowledge', {
        query: query,
        knowledge_base_id: kbId,
        cursor: ""
    });
    return JSON.parse(resp);
}

async function getAddableKnowledgeBaseList() {
    const resp = await imaApi('openapi/wiki/v1/get_addable_knowledge_base_list', {
        cursor: "",
        limit: 50
    });
    return JSON.parse(resp);
}

module.exports = {
    searchKnowledgeBases,
    getKnowledgeBase,
    getKnowledgeList,
    getFolders,
    addNoteToKnowledgeBase,
    searchKnowledge,
    getAddableKnowledgeBaseList
};
