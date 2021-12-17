#!/bin/bash

set -e 
set -o pipefail

cd /home/zokrates/code/square

~/zokrates compile -i square.code
~/zokrates setup

for i in {1..11} 
do
  ~/zokrates compute-witness -a 3 9 -o "witness-$i"
  ~/zokrates generate-proof -j "proof-$i.json" -w "witness-$i"
done

~/zokrates export-verifier