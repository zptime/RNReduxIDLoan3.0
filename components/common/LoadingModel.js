import React from 'react';

import RootSiblings from 'react-native-root-siblings';

import LoadingContainer from './LoadingContainer';

let loading = null;

export default class LoadingModel {
    static show() {
        if (!loading) {
            loading = new RootSiblings(<LoadingContainer />);
        }
    }

    static hide() {
        if (loading instanceof RootSiblings) {
            loading.destroy();
            loading = null;
        }
    }
}