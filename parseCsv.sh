#!/bin/bash

awk 'BEGIN{ FS=","; OFS=sprintf("%c", 0x1F); } { print $1, $2, $6; }' ./testInputs/receipts\(1\).csv > ./testInputs/output.txt;

