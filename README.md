# CAVS-1
## Script for Ubuntu 18.04 (Bionic) only
1. Download image from Discord #cavs-documents-and-links
2. Set no sudo password \
`sudo visudo` \
In the bottom of the file, add the following line: \
`$USER ALL=(ALL) NOPASSWD: ALL` \
Save changes
3. Clone Repo \
   `git clone https://github.com/Gandlfer/CAVS-1` \
   `git checkout installation`
4. Run Script`./Step.sh`
5. Run image\
   `singularity shell mavs-ros-m.image`
7. Install dependency\
   `source /opt/ros/melodic/setup.bash`\
   `cd ~/catkin_ws`\
   `catkin_make install`
