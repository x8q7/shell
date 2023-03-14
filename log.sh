#!/bin/bash
cur_dateTime=$(date "+%Y-%m-%d %H:%M:%S")
echo "=============================================================================="
echo "Please input infomation!"
read commitInfo
echo "[$cur_dateTime] $commitInfo" >> mylog.log
echo "=============================================================================="
echo "success!"
exit 0
