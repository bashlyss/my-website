#!/bin/bash
service apache restart
service nginx restart
python wassup/wassup.py &
