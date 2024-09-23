# CAVS-1
## Script for Ubuntu 18.04 (Bionic) only
1. Download image from Discord #cavs-documents-and-links
2. Set no sudo password \
`su` as root user \
`sudo visudo` \
In the bottom of the file, add the following line: \
`$USER ALL=(ALL) NOPASSWD: ALL` Note: Replace $USER to your username \
Save changes and `exit`
4. Clone Repo \
   `git clone https://github.com/Gandlfer/CAVS-1` \
   `git checkout installation`
5. Run Script`./Step.sh`
6. Run image\
   `singularity shell mavs-ros-m.image`
7. Install dependency\
   `source /opt/ros/melodic/setup.bash`\
   `cd ~/catkin_ws`\
   `catkin_make install`
8. `source ~/catkin_ws/devel/setup.bash`
9. Launch mavs with `roslaunch nature mavs_example_proving_ground.launch`
   
