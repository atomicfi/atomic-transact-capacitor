package com.atomicfi.transact;

import com.getcapacitor.Logger;

public class TransactPlugin {

    public String echo(String value) {
        Logger.info("Echo", value);
        return value;
    }
}
